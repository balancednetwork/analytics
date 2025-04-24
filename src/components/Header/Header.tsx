import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import logo from '../../assets/images/balanced-logo.png';

const StyledHeader = styled.header`
margin: 50px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled.img`
  width: 100px;
  height: 75px;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  transition: color ${({ theme }) => theme.transitions.fast};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-weight: 600;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Logo to="/">
        <StyledLogo src={logo} alt="Chain Stats Logo" />
      </Logo>
      
      <Nav>
        <NavLink to="/how-to">How-to</NavLink>
        <NavLink to="/demo">Demo</NavLink>
        <NavLink to="/stats" $isActive>Stats</NavLink>
      </Nav>
    </StyledHeader>
  );
}; 